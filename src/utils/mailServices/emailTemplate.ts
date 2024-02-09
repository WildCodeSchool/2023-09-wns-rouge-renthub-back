export type EmailTemplateParams = {
  content: string
  title: string
}

export const createEmailTemplate = ({
  content,
  title,
}: EmailTemplateParams): string => {
  return `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body {
            font-family: Helvetica, Arial, sans-serif;
            background-color: #fff;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background-color: #f8f8f8;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            font-size: 24px;
            color: #152535;
            padding-bottom: 10px;
            border-bottom: 3px solid #e89116;
            text-align: center;
          }
          .content {
            padding: 20px 0;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #ff8e3c;
            color: #fff;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #343a40;
          }
          .link {
            display: block;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            margin-top: 10px;
            font-size: 18px;
            color:  #ff8e3c;
          }
          .rentHub {
            text-align: center;
            margin-top: 10px;
            font-size: 12px;
            color:  #343a40;
          }
        </style>
      </head>
      <body>
        <div class="container">
            ${content}
            <a href="${process.env.FRONTEND_URL}" class="link">renthub.shop</a>
            <p class="rentHub">© RentHub 2024</p>
        </div> 
      </body>
      </html>`
}
