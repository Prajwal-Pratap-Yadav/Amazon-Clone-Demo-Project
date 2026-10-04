# Amazon Clone Documentation

## Overview

This project is a static replica of the Amazon website, designed for educational and demonstration purposes. The implementation uses **HTML** and **CSS** to replicate the design and functionality of Amazon’s user interface.

---

## Features

### 1. Header Section

- Contains:
  - **Logo**: Displays the Amazon logo.
  - **Address**: "Deliver to" section with an option to change the location.
  - **Search Bar**: Includes a dropdown for categories, a text input for search queries, and a search button.
  - **Language Selector**: Dropdown to switch between languages.
  - **Sign-In Section**: Displays options for signing in and managing the account.
  - **Orders & Returns**: Link to the user’s order history.
  - **Cart**: Shopping cart icon with a label.

### 2. Navigation Panel

- Includes links to various sections such as "Today's Deals," "Customer Service," "Registry," "Gift Cards," and "Sell."
- Special promotions like "Shop Deals in Electronics" are highlighted.

### 3. Hero Section

- A large banner with a promotional message, including a link to redirect users to Amazon India.

### 4. Shop Section

- Displays multiple product categories in individual boxes.
- Each box contains:
  - A title.
  - A background image related to the category.
  - A "See more" link.

### 5. Footer Section

- **Back to Top Button**: Provides quick navigation back to the top of the page.
- **Footer Links**: Includes multiple columns with links categorized under headers like "Get to Know Us," "Make Money with Us," and "Amazon Payment Products."
- **Legal and Copyright Information**: Displays Amazon's terms of use, privacy policies, and copyright details.

---

## File Structure

```
.
├── index.html      # Main HTML file
├── style.css       # Stylesheet for the website
├── assets/         # Directory containing images (e.g., logo and background images)
```

---

## Code Analysis

### HTML

- **Meta Tags**: Ensures compatibility across devices with `meta charset="UTF-8"` and `meta name="viewport" content="width=device-width, initial-scale=1.0"`.
- **External Resources**:
  - Font Awesome for icons.
  - External CSS for styling.
- **Semantic Elements**: Proper usage of `<header>`, `<div>`, `<footer>` for structuring content.

### CSS

#### General Styling

- Reset applied with:
  ```css
  * {
    margin: 0;
    font-family: Arial;
    box-sizing: border-box;
  }
  ```

#### Navbar

- Flexbox is utilized to align items horizontally.
- Hover effects applied to borders.
- Example:
  ```css
  .border:hover {
    border: 1.5px solid white;
  }
  ```

#### Hero Section

- Background image with:
  ```css
  .hero-section {
    background-image: url(first_image.jpg);
    background-size: cover;
  }
  ```

#### Shop Section

- Responsive layout achieved using `flex-wrap`.
- Example box styling:
  ```css
  .box {
    height: 400px;
    width: 23%;
    padding: 20px 0;
    background-color: white;
  }
  ```

#### Footer

- Multi-column layout with flexbox.
- Color themes match the Amazon branding with shades of gray and black.

---

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/amazon-clone.git
   ```
2. Open `index.html` in a web browser.

---

## Future Improvements

- Add JavaScript functionality to handle user interactions such as dropdown menus, cart management, and search.
- Make the design fully responsive for mobile devices.
- Integrate backend APIs to fetch dynamic content.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Author

**Prajwal Pratap Yadav**
