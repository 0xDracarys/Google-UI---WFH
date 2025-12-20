
# How to Fix Your Render Deployment

Based on the screenshot you provided, your Render deployment is failing because of two incorrect settings. Please follow these steps to fix the issue:

1.  **Go to your Static Site settings on Render.**
2.  **Find the "Build & Deploy" section.**
3.  **Set the "Publish Directory":**
    *   **Current Value:** (empty)
    *   **New Value:** `dist`

4.  **Update the "Build Command":**
    *   **Current Value:** `npm install; npm run build`
    *   **Recommended New Value:** `npm install && npm run build`

    *(Using `&&` ensures that the build only runs if the installation succeeds, which is more reliable.)*

After making these two changes, the error message in Render should disappear, and you should be able to click "Deploy Static Site".
