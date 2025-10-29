import { NextApiRequest, NextApiResponse } from 'next';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import formidable, { File } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = new Storage({
  keyFilename: path.join(process.cwd(), "important/photography-portfolio-475101-6a818f3c44c4.json"),
});

const bucket = storage.bucket("photography-photos");

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files}> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({fields, files});
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method not allowed'});
  }

  try {
    const { fields, files } = await parseForm(req);

    const fileArray = files.file as File[] | undefined;

    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({ message: 'No file provided '});
    }

    const file = fileArray[0];

    const folderPath = Array.isArray(fields.folderPath) ? fields.folderPath[0] : fields.folderPath;
    const isPublic = Array.isArray(fields.public) ? fields.public[0] === 'true' : fields.public === 'true';

    if (!file) {
      return res.status(400).json({message : 'No file provided'});
    }

    const timestamp = Date.now();
    const originalName = file.originalFilename || 'file';
    const safeFileName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
    const destination = `${folderPath || 'uploads'}/${timestamp}_${safeFileName}`;

    const gcsFile = bucket.file(destination);

    await gcsFile.save(fs.readFileSync(file.filepath), {
      metadata: {
        constentType: file.mimetype || 'application/octet-stream',
      },
    });

    if (isPublic) {
      await gcsFile.makePublic();
    }

    const [metadata] = await gcsFile.getMetadata();

    fs.unlinkSync(file.filepath);

    const result = {
      url: isPublic ? `https://storage.googleapis.com/${bucket.name}/${destination}` : '',
      fileName: destination,
      size: parseInt(String(metadata.size || '0')),
      contentType: metadata.contentType || '',
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Upload failed'
    });
  }
}