import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

const ALLOWED_BUCKETS = ['avatars', 'resumes', 'certificates', 'project-assets'];

export const getUploadUrl = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { bucket, filename } = req.body;

    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return res.status(400).json({ error: 'Invalid bucket' });
    }

    // Path structure: {userId}/{timestamp}-{filename}
    const path = `${userId}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      console.error('[Supabase Storage Error]', error);
      return res.status(500).json({ error: 'Failed to generate upload URL' });
    }

    // Also construct the public/signed read URL for the client to save in DB
    let readUrl = '';
    if (bucket === 'avatars' || bucket === 'project-assets') {
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
      readUrl = publicData.publicUrl;
    } else {
      // For private buckets, the client will need to request signed read URLs later
      // But we can just store the path in DB.
      readUrl = path; 
    }

    res.json({
      success: true,
      data: {
        signedUrl: data.signedUrl,
        path: data.path,
        token: data.token,
        readUrl
      }
    });
  } catch (error) {
    console.error('[getUploadUrl]', error);
    res.status(500).json({ error: 'Internal server error generating upload URL' });
  }
};
