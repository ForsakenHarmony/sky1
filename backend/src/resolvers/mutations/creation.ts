import { Resolvers } from '../../index';

import * as cloudinary from 'cloudinary';

async function upload(stream) {
  const res = await new Promise<{public_id: string, secure_url: string, error?: { http_code, message }}>((res, rej) => {
    try {
      const upload = cloudinary.uploader.upload_stream(res);
      stream.pipe(upload);
    } catch (e) {
      rej(e);
    }
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res;
}

// const upload = async (stream) => {
//   const res = await new Promise<{public_id: string, secure_url: string, error?: { http_code, message }}>((res, rej) => {
//     try {
//       const upload = cloudinary.uploader.upload_stream(res);
//       stream.pipe(upload);
//       upload.end();
//     } catch (e) {
//       rej(e);
//     }
//   });
//   if (res.error) {
//     throw new Error(res.error.message);
//   }
//   return res;
// };

const Creation: Resolvers = {
  async createCreation(
    parent,
    { creation: { name, description, status, pictures, file, tags } },
    { db, user, b2 },
    info
  ) {
    const pics = await Promise.all(pictures);

    const files = await Promise.all(
      pics.map(async ({ stream, filename }) => {
        try {
          const {
            public_id: name,
            secure_url: url,
          } = await upload(stream);

          return {
            name,
            url,
          };
        } catch (e) {
          console.error(e);
          throw new Error(`Could not upload ${filename}`);
        }
      })
    );

    return db.mutation.createCreation(
      {
        data: {
          creator: {
            connect: {
              id: user.id,
            },
          },
          likes: 0,
          name,
          description,
          status,
          tags,
          pictures: {
            create: files,
          },
        },
      },
      info
    );
  },
};

export default Creation;
