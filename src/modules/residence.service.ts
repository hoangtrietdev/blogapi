import { Injectable } from '@nestjs/common';
import { createBaseService } from 'src/core/factory.service';
import { Resident } from 'src/models/resident.entity';

const BaseResidenceService = createBaseService(Resident);

@Injectable()
export class ResidenceService extends BaseResidenceService {}
