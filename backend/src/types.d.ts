declare module 'backblaze-b2' {
  class B2 {
    constructor(options: { accountId: string; applicationKey: string });

    authorize(): Promise<null>;

    getUploadUrl(
      bucketId: string
    ): Promise<{
      data: {
        bucketId: string;
        uploadUrl: string;
        authorizationToken: string;
      };
    }>;

    uploadFile(options: {
      uploadUrl: string;
      uploadAuthToken: string;
      filename: string;
      mime?: string;
      data: string;
      hash?: string;
    }): Promise<{
      data: {
        fileId: string;
        fileName: string;
        accountId: string;
        bucketId: string;
        bucketLength: number;
        contentSha1: string;
        contentType: string;
      };
    }>;
  }

  namespace B2 {

  }

  export = B2;
}

declare module 'cloudinary' {
  import { Writable } from 'stream';
  namespace cloudinary {
    namespace uploader {
      function upload(
        file: string,
        options: Record<string, any>,
        callback: Function
      );
      function upload_stream(callback: Function, options?: Record<string, any>): Writable;
    }

    function url(public_id: string, options: Record<string, any>);
    function image(source: string, options: Record<string, any>);
  }

  export = cloudinary;
}
