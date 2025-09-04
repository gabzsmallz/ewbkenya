import { google } from 'googleapis';
export async function getSheets(){
  const auth=new google.auth.GoogleAuth({
    credentials:{client_email:process.env.GSHEETS_CLIENT_EMAIL,private_key:(process.env.GSHEETS_PRIVATE_KEY||'').replace(/\\n/g,'\n')},
    scopes:['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({version:'v4',auth});
}
