jest.mock('fs', () => ({
  promises: {
    unlink: jest.fn(),
    stat: jest.fn(),
    writeFile: jest.fn(),
  },
}));

jest.mock('../../config/storage.config', () => ({
  uploadConfig: {
    isProduction: false,
    uploadDir: 'C:\\eventforge\\uploads',
  },
}));

jest.mock('../../config/aws.config', () => ({
  s3: {
    send: jest.fn(),
  },
  s3Config: {
    bucket: 'test-bucket',
    region: 'us-east-1',
    acl: 'public-read',
  },
}));

import { promises as fs } from 'fs';
import { fileService } from '../../services/file.service';

describe('fileService', () => {
  const mockedUnlink = fs.unlink as jest.MockedFunction<typeof fs.unlink>;
  const mockedStat = fs.stat as jest.MockedFunction<typeof fs.stat>;
  const mockedWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws 400 for unmanaged file urls on delete', async () => {
    await expect(fileService.deleteFile('https://example.com/file.png')).rejects.toMatchObject({
      statusCode: 400,
      message: 'File URL is not managed by this service',
    });
  });

  it('does not throw when local file is already missing', async () => {
    mockedUnlink.mockRejectedValueOnce({ code: 'ENOENT' });

    await expect(fileService.deleteFile('/uploads/events/missing.png')).resolves.toBeUndefined();
  });

  it('returns 404 when metadata target file does not exist', async () => {
    mockedStat.mockRejectedValueOnce({ code: 'ENOENT' });

    await expect(fileService.getFileMetadata('/uploads/events/missing.png')).rejects.toMatchObject({
      statusCode: 404,
      message: 'File not found',
    });
  });

  it('writes local file buffer and returns managed local url', async () => {
    mockedWriteFile.mockResolvedValueOnce(undefined);

    const result = await fileService.uploadBuffer(
      Buffer.from('abc'),
      'events/file.png',
      'image/png'
    );

    expect(mockedWriteFile).toHaveBeenCalled();
    expect(result).toBe('/uploads/events/file.png');
  });

  it('preserves unexpected delete errors as 500 AppError', async () => {
    mockedUnlink.mockRejectedValueOnce(new Error('disk error'));

    await expect(fileService.deleteFile('/uploads/events/file.png')).rejects.toMatchObject({
      statusCode: 500,
      message: 'Failed to delete file',
    });
  });
});
