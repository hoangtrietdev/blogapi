import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { createBaseController } from 'src/core/factory.controller';
import { Resident } from 'src/models/resident.entity';
import { ResidenceService } from './residence.service';
import { diskStorage } from 'multer';

const BaseResidenceController = createBaseController(
  Resident,
  ResidenceService,
);

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

@ApiTags('resident')
@Controller('resident')
export class ResidenceController extends BaseResidenceController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: '../client/src/pages/residences/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file) {
    try {
      const response = {
        originalname: file.originalname,
        filename: file.filename,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
}
