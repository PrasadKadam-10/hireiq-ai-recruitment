import asyncio
import sys
sys.path.insert(0, '.')

async def test():
    from src.data_extraction import extract_cv_data
    from src.llm_provider import create_evaluation_llm
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser

    cv_text = extract_cv_data('C:/Users/admin/Documents/PRASAD KADAM RESUME.pdf')
    print('CV LENGTH:', len(cv_text))
    print('CV PREVIEW:', cv_text[:300])

    llm = create_evaluation_llm()
    prompt = ChatPromptTemplate.from_template(
        "Evaluate this candidate for Senior AI Engineer.\n"
        "CV: {cv_text}\n"
        "Return JSON only: {{\"score\": 75, \"reasoning\": \"good\", \"strengths\": [\"s1\"], \"gaps\": [\"g1\"], \"decision\": \"hire\"}}"
    )
    chain = prompt | llm | StrOutputParser()
    result = await chain.ainvoke({'cv_text': cv_text[:2000]})
    print('RESULT:', result)

asyncio.run(test())