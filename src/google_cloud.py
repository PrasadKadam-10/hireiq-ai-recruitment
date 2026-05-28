
# ============================================================================
# GOOGLE CLOUD
# ============================================================================

from google.cloud import storage
from io import BytesIO
from google.oauth2 import service_account
from src.config import Config
from datetime import timedelta

class GCSUploader:
    def __init__(self, bucket_name: str):
        creds = service_account.Credentials.from_service_account_file(
            Config.GOOGLE_CREDENTIALS_PATH
        )
        self.client = storage.Client(credentials=creds)
        self.bucket = self.client.bucket(bucket_name)


    def upload_pdf(self, pdf_bytes: BytesIO, filename: str) -> dict:
        pdf_bytes.seek(0)
        # filename = f"cvs/{candidate_name.replace(' ', '_')}_{uuid.uuid4().hex}.pdf"
        blob = self.bucket.blob(filename)
        blob.upload_from_file(
            pdf_bytes,
            content_type="application/pdf"
        )

        # Generate signed URL
        signed_url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(hours=24),
            method="GET"
        )

        return {
            "signed_url": signed_url
        }
