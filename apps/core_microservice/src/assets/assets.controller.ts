import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Param,
  Res,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { AssetsService } from './assets.service';
import {
  editFileName,
  imageAndVideoFileFilter,
} from './utils/file-upload.utils';
import { getContentType } from './utils/content-type.utils';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../decorators/current-user.decorator';

const FILE_SIZE_LIMIT = 50 * 1024 * 1024;

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get(':filename') // пересмотреть вообще нужны ли настройки корсов
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download uploaded file' })
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    res.set('Content-Type', getContentType(filename));
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    try {
      await pipeline(createReadStream(filePath), res);
    } catch {
      throw new InternalServerErrorException('Failed to stream file');
    }
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a file (image or video)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageAndVideoFileFilter,
      limits: { fileSize: FILE_SIZE_LIMIT },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: CurrentUserData,
  ) {
    return await this.assetsService.createAsset(file, user.id);
  }
}
