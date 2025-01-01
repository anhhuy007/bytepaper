from newspaper import Article
import json
from datetime import datetime
from bs4 import BeautifulSoup
from datetime import datetime
from random import choice
import os
# 'draft', 'submitted', 'approved', 'published', 'rejected'
statuses = ['draft', 'submitted', 'approved', 'published', 'rejected']

class MyArticle:
    def __init__(self):
        self.title = ""
        self.abstract = ""
        self.content = ""
        self.top_image = ""
        self.authors = []
        self.imgs = []
        self.tags = []
        self.categories = []
        self.status = ""
        self.is_premium = False
        self.published_at = ""
        self.updated_at = ""

    def __str__(self):
        return f"Article: {self.title}"
    
    def to_dict(self):
        """Convert article object to dictionary for JSON serialization"""
        return {
            'title': self.title,
            'abstract': self.abstract,
            'content': self.content,
            'top_image': self.top_image,
            'content_images': list(self.imgs),  # Convert set to list if imgs is a set
            'categories': self.categories,
            'tags': list(self.tags),   # Convert set to list if tags is a set
            'authors': self.authors,
            'status': self.status,
            'is_premium': self.is_premium,
            'published_at': self.published_at.isoformat() if isinstance(self.published_at, datetime) else str(self.published_at),
            'updated_at': self.updated_at.isoformat() if isinstance(self.updated_at, datetime) else str(self.updated_at)
        }
        
class Category:
    def __init__(self, name):
        self.name = name
        self.subcategories = set()  # Use a set instead of a list

    def add_subcategory(self, subcategory):
        self.subcategories.add(subcategory)  # Add to the set

    def remove_subcategory(self, subcategory):
        self.subcategories.discard(subcategory)  # Safely remove, no error if not present

    def get_subcategories(self):
        return sorted(self.subcategories)  # Optional: Return as a sorted list

def get_article_urls(filename):
    with open(filename) as f:
        urls = [url.strip() for url in f.readlines()]  # Remove whitespace/newlines
        
    # remove url not ending with .html
    urls = [url for url in urls if url.endswith(".html")] 
    
    return urls

def get_article(url):        
    article = Article(url)
    article.download()
    article.parse()    
        
    # extract html content to get the categories, subcategories, and publish date with BeautifulSoup
    soup = BeautifulSoup(article.html, 'lxml')
    breadcrumbs = soup.find('ul', class_='breadcrumb')
    values = [a.text for a in breadcrumbs.find_all('a')]
    
    # extract publish date
    publish_date = soup.find('span', class_='date')
    
    # format the publish date to timestamp
    dow, pd, time_str = publish_date.text.split(", ")
    # remove the timezone
    time_str = "," + time_str.split(" (")[0]
    publish_date = pd + time_str
    publish_date = datetime.strptime(publish_date, "%d/%m/%Y,%H:%M")
    
    # extract authors
    # Find all <p> tags with class "Normal"
    normal_paragraphs = soup.find_all("p", class_="Normal")

    # Filter for the one with <strong> tag and optional style
    for p in normal_paragraphs:
        strong_tag = p.find("strong")
        if strong_tag:  # Ensure the <strong> tag exists
            article.authors.append(strong_tag.text)
            
        
    article.publish_date = publish_date
    article.categories = values
    article.status = "published"
    article.is_premium = choice([True, False])
    article.updated_at = datetime.now()
    
    # filter content images. Only save images that url contains '.jpg'
    article.imgs = {img for img in article.imgs if '.jpg' in img}
    
    # remove first sentence from content
    content = article.text
    first_sentence = content.split("\n")[0]
    article.text = content.replace(first_sentence, "")
    # remove 2 "\n" from the beginning of the content
    article.text = article.text[2:]
    
    
    return article

def save_articles_to_json(articles, output_filename):
    """Save list of articles to JSON file"""
    articles_data = [article.to_dict() for article in articles]
    
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(articles_data, f, ensure_ascii=False, indent=2)
        
def extract_categories(soup):
    """Extract categories and subcategories from article HTML"""
    breadcrumbs = soup.find('ul', class_='breadcrumb')
    values = [a.text for a in breadcrumbs.find_all('a')]
    return values

def get_articles():
    articles = []  # List to store all article objects
    urls = get_article_urls("urls.txt")
    
    cnt = 0
    for url in urls:
        try:
            print(f"Getting article from {url}...")
            article = get_article(url)
            
            my_article = MyArticle()
            my_article.title = article.title
            my_article.abstract = article.meta_description
            my_article.content = article.text
            my_article.top_image = article.top_image
            my_article.imgs = article.imgs
            my_article.tags = article.tags
            my_article.categories = article.categories
            my_article.authors = article.authors
            my_article.status = article.status
            my_article.is_premium = article.is_premium
            my_article.published_at = article.publish_date
            my_article.updated_at = article.updated_at
            
            articles.append(my_article)
            cnt += 1
            if cnt == 5:
                break

        except Exception as e:
            print(f"Error processing {url}: {str(e)}")
    
    # Save all articles to JSON file
    output_filename = "articles.json"
    save_articles_to_json(articles, output_filename)
    print(f"Successfully saved {len(articles)} articles to {output_filename}")
    
def extract_categories(file_path):
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            return json.dumps({
                "error": f"File not found: {file_path}",
                "categories": []
            }, ensure_ascii=False, indent=2)
        
        # Read the JSON file
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Ensure data is a list
        if not isinstance(data, list):
            data = [data]
        
        # Collect categories
        category_map = {}
        
        # Process each item in the array
        for item in data:
            # Extract categories for this item
            categories = item.get('categories', [])
            
            # Skip if not enough categories
            if len(categories) < 2:
                continue
            
            main_category = categories[0]
            subcategory = categories[1]
            
            # Organize categories
            if main_category not in category_map:
                category_map[main_category] = set()
            
            # Add subcategory
            category_map[main_category].add(subcategory)
        
        # Prepare output as an array of objects
        output = [
            {
                "category": category,
                "subcategories": list(subcategories)
            }
            for category, subcategories in category_map.items()
        ]
        
        return json.dumps(output, ensure_ascii=False, indent=2)
    
    except json.JSONDecodeError:
        return json.dumps({
            "error": f"Invalid JSON in file: {file_path}",
            "categories": []
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({
            "error": f"Error processing file: {str(e)}",
            "categories": []
        }, ensure_ascii=False, indent=2)

def main():
    response = extract_categories("./articles.json")
    with open("categories.json", "w", encoding="utf-8") as f:
        f.write(response)

if __name__ == "__main__":
    main()