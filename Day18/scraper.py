import requests
from bs4 import BeautifulSoup


url = "https://remoteok.com/remote-dev-jobs"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)

context = BeautifulSoup(response.text, "html.parser")

jobs_table = context.find("table", id="jobsboard")
jobs = jobs_table.find_all("tr", class_="job")

for job in jobs:
    title = job.find("h2", itemprop="title")
    company = job.find("h3", itemprop="name")
    location = job.find("div", class_="location")
    
    if title:
        print(f"Job Title: {title.text.strip()}")
    if company:
        print(f"Company: {company.text.strip()}")
    if location:
        print(f"Location: {location.text.strip()}")
    print("-" * 40)