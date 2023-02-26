@echo off

rem create virtual environment if not exists
py -3 -m venv venv

rem activate virtual environment
call venv\Scripts\activate.bat

rem install dependencies from requirements.txt
pip install -r requirements.txt

rem start the server
uvicorn main:app --reload
