import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'; import { google } from 'googleapis';
export default async function handler(req,res){
  const supabase=createPagesServerClient({req,res});
  const { data:{ user }, error:authError } = await supabase.auth.getUser();
  if(authError) return res.status(500).json({error:authError.message});
  if(!user) return res.status(401).json({error:'Not authenticated'});
  const { data:profile, error:profileError } = await supabase.from('profiles').select('id,role,full_name,email').eq('id',user.id).maybeSingle();
  if(profileError) return res.status(500).json({error:profileError.message});
  if(!profile) return res.status(403).json({error:'Member profile required'});
  if(profile.role!=='member' && profile.role!=='admin') return res.status(403).json({error:'Only members can volunteer'});
  if(req.method==='GET'){
    const projectId=parseInt(req.query?.projectId,10);
    if(!projectId) return res.status(400).json({error:'Missing projectId'});
    const { data:signup, error:signupError } = await supabase.from('project_signups').select('message,skills,availability,created_at').eq('project_id',projectId).eq('profile_id',profile.id).maybeSingle();
    if(signupError) return res.status(500).json({error:signupError.message});
    return res.status(200).json({ signup: signup||null });
  }
  if(req.method==='POST'){
    const { projectId, message, skills, availability } = req.body||{};
    const projectIdNum=parseInt(projectId,10);
    if(!projectIdNum) return res.status(400).json({error:'Missing projectId'});
    const normalized={
      project_id:projectIdNum,
      profile_id:profile.id,
      message:typeof message==='string'&&message.trim()?message.trim():null,
      skills:typeof skills==='string'&&skills.trim()?skills.trim():null,
      availability:typeof availability==='string'&&availability.trim()?availability.trim():null,
    };
    const { data:existing, error:existingError } = await supabase.from('project_signups').select('id').eq('project_id',projectIdNum).eq('profile_id',profile.id).maybeSingle();
    if(existingError) return res.status(500).json({error:existingError.message});
    const { error:upsertError } = await supabase.from('project_signups').upsert(normalized,{onConflict:'project_id,profile_id'});
    if(upsertError) return res.status(500).json({error:upsertError.message});
    if(!existing){
      try{
        if(process.env.GSHEETS_SPREADSHEET_ID){
          const auth=new google.auth.GoogleAuth({credentials:{client_email:process.env.GSHEETS_CLIENT_EMAIL,private_key:(process.env.GSHEETS_PRIVATE_KEY||'').replace(/\\n/g,'\n')},scopes:['https://www.googleapis.com/auth/spreadsheets']});
          const sheets=google.sheets({version:'v4',auth});
          await sheets.spreadsheets.values.append({spreadsheetId:process.env.GSHEETS_SPREADSHEET_ID,range:'Signups!A1',valueInputOption:'USER_ENTERED',requestBody:{values:[[new Date().toISOString(),projectIdNum,profile.full_name||'',profile.email||user.email||'',normalized.skills||'',normalized.availability||'',normalized.message||'']]}});
        }
      }catch(e){}
    }
    return res.status(200).json({ok:true,message:existing?'Signup updated':'Signup submitted'});
  }
  res.setHeader('Allow',['GET','POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
