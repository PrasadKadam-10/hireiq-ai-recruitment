# ============================================================================
# GOOGLE SERVICES
# ============================================================================

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload
import io
from googleapiclient.http import MediaIoBaseUpload
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from src.config import Config

def create_message(to: str, subject: str, html_content: str):
    message = MIMEMultipart("alternative")

    # IMPORTANT: From must match impersonated account
    message["From"] = "hr@yourcompany.com"
    message["To"] = to
    message["Subject"] = subject

    message.attach(MIMEText(html_content, "html"))

    raw_message = base64.urlsafe_b64encode(
        message.as_bytes()
    ).decode("utf-8")

    return {
        "raw": raw_message
    }


class GoogleServices:
    """Handle Google Drive and Sheets operations"""

    ## Google Service Account Required
    def __init__(self):
        scopes = [
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/spreadsheets"
            "https://www.googleapis.com/auth/gmail.send"
        ]

        self.creds = Credentials.from_service_account_file(
            Config.GOOGLE_CREDENTIALS_PATH,
            scopes=scopes
        )

        self.drive_service = build("drive", "v3", credentials=self.creds)
        self.sheets_service = build("sheets", "v4", credentials=self.creds)
        self.gmail_service = build("gmail", "v1", credentials=self.creds)

    def download_file(self, file_url: str) -> bytes:
        """Download file from Google Drive"""
        # Extract file ID from URL
        file_id = file_url.split('/d/')[1].split('/')[0] if '/d/' in file_url else file_url

        request = self.drive_service.files().get_media(fileId=file_id)
        file_buffer = io.BytesIO()
        downloader = MediaIoBaseDownload(file_buffer, request)

        done = False
        while not done:
            status, done = downloader.next_chunk()

        return file_buffer.getvalue()


    def upload_file(self, file_content: bytes, filename: str, folder_id: str) -> dict:
        """Upload file to Google Drive"""
        file_metadata = {
            'name': filename,
            'parents': [folder_id]
        }

        file_bytes = io.BytesIO(file_content)
        file_bytes.seek(0)
        media = MediaIoBaseUpload(
            file_bytes,
            mimetype='application/pdf',
            resumable=True
        )

        file = self.drive_service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id,webViewLink'
        ).execute()

        return file

    def append_to_sheet(self, sheet_id: str, sheet_name: str, values: list):
        """Append row to Google Sheets"""
        body = {'values': [values]}

        self.sheets_service.spreadsheets().values().append(
            spreadsheetId=sheet_id,
            range=f'{sheet_name}!A:M',
            valueInputOption='RAW',
            body=body
        ).execute()


    def send_email(self, subject: str, body_html: str):
        """Send email"""
        self.gmail_service.users().messages().send(
            userId="me",
            body=create_message(
                to="hiring.manager@yourcompany.com",
                subject=subject,
                html_content="<p>Candidate details here...</p>"
            )
        ).execute()