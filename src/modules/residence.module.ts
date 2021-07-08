import { ResidenceService } from './residence.service';
import { ResidenceController } from './residence.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resident } from 'src/models/resident.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resident]),
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [ResidenceController],
  providers: [ResidenceService],
})
export class ResidenceModule {}
