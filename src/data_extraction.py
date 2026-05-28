"""
PDF Data Extraction - HireIQ
Uses pdfplumber (no torch, no heavy dependencies)
"""

import pdfplumber
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def extract_cv_data(cv_file_path: str) -> str:
    """
    Extract raw text from PDF resume
    
    Args:
        cv_file_path: Path to PDF file
        
    Returns:
        Extracted text as string
    """
    if not cv_file_path:
        raise ValueError("cv_file_path is required")
    
    path = Path(cv_file_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF not found: {cv_file_path}")
    
    if not path.suffix.lower() == ".pdf":
        raise ValueError(f"File must be a PDF: {cv_file_path}")
    
    text_parts = []
    
    try:
        with pdfplumber.open(cv_file_path) as pdf:
            logger.info(f"📄 Extracting text from {len(pdf.pages)} pages")
            
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(f"--- Page {i+1} ---\n{page_text.strip()}")
        
        full_text = "\n\n".join(text_parts)
        
        if not full_text.strip():
            raise ValueError("No text extracted from PDF — may be scanned/image PDF")
        
        logger.info(f"✅ Extracted {len(full_text)} characters from PDF")
        return full_text
        
    except Exception as e:
        logger.error(f"❌ PDF extraction failed: {str(e)}")
        raise


def extract_text_chunks(cv_file_path: str, chunk_size: int = 500) -> list[str]:
    """
    Extract text from PDF in chunks for vector storage
    
    Args:
        cv_file_path: Path to PDF file
        chunk_size: Characters per chunk
        
    Returns:
        List of text chunks
    """
    full_text = extract_cv_data(cv_file_path)
    
    # Split into chunks
    words = full_text.split()
    chunks = []
    current_chunk = []
    current_size = 0
    
    for word in words:
        current_chunk.append(word)
        current_size += len(word) + 1
        
        if current_size >= chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_size = 0
    
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    
    logger.info(f"✅ Split into {len(chunks)} chunks")
    return chunks