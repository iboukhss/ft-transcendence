# Google Oauth Setup

# Creating Oauth client

to make the oauth from google work we first need to create a google cloud Client.
to create a client  visit https://console.cloud.google.com/auth/clients.
- first a new project.
- click create client
- Select the **Web application** application type.
-  in authorized redirection url add the following url"https://localhost:3000/api/oauth/google and click create.
- now the oauth clientID and client secret schould be generated and displayed.
- (**important**)  make sure to save the client secret before you continue, since after closing the window you wont be able to view the secret again, so make sure you have save it before hand.

## Acess Credentials

now that you have the credentials , you have to put them in the .env file in the variabels **GOOGLE_OAUTH_CLIENT_ID** and  **GOOGLE_OAUTH_CLIENT_KEY** the variables are provided in the env.example file.
