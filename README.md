# Web Development Final Project - *Cloud Canvas*

Submitted by: **Ruhi Sawant**

This web app: **Cloud Canvas is a weather-inspired social platform that allows users to create, share, and explore posts with unique clouds. Users can add images, describe the cloud type, upvote posts, and engage through comments. The app promotes creativity through a dynamic UI and filters for browsing different cloud types.**

Time spent: **~10** hours spent in total

---

## ✅ Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Form allows optional:
    - textual content
    - image via external image URL

- [x] **Web app includes a home feed displaying previously created posts**
  - Home feed displays:
    - post title
    - creation time
    - upvote count
  - Clicking a post navigates to the detailed post page

- [x] **Users can view posts in different ways**
  - Posts can be sorted by:
    - creation time
    - upvote count
  - Users can search posts by title

- [x] **Users can interact with each post in different ways**
  - Separate post page includes:
    - full content
    - image
    - comments
  - Users can:
    - leave comments
    - upvote any post (no limits)

- [x] **A post that a user previously created can be edited or deleted**
  - Users can edit a post from its post page
  - Users can delete a post from its post page

---

## ✨ Optional Features

The following **optional** features are implemented:

- [x] Web app implements pseudo-authentication
  - Each post includes a user-assigned secret key for edit/delete
  - Only original authors can modify or delete their post using the key

- [x] Users can customize the interface
  - Posts on the feed display the cloud type icon and image preview
  - UI uses a modern, component-based design (ShadCN, Lucide)

- [x] Users can add more characteristics to their posts
  - Posts include `cloudType` tags like "Cumulus", "Stratus", etc.
  - Users can filter posts by cloud type from the home feed

- [x] Web app displays a loading animation when data is being fetched

---

## 🧠 Additional Features

- [x] Masonry grid layout for posts for a photography-focused aesthetic
- [ ] Story scroll banner for featured or recent cloud images
- [x] Responsive layout optimized for both desktop and mobile

---

## 🎥 Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='/src/assets/walkthrough.gif' title='Video Walkthrough' width='100%' alt='Video Walkthrough' />

GIF created with [AdobeExpress](https://www.adobe.com/express/feature/video/convert/mov-to-gif)

---

## 📝 Notes

Challenges encountered:
- Debugging Supabase insert/update errors due to missing columns
- Handling form validation for optional image URLs
- Designing a responsive masonry layout with conditional rendering
- Learning and integrating `shadcn/ui` and `lucide-react` for consistent design

---

## 🧾 License

    Copyright 2025 Ruhi Sawant

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.