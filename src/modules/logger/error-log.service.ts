import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorLog, ErrorLogDocument } from './schemas/error-log.schema';

@Injectable()
export class ErrorLogService {
  constructor(
    @InjectModel(ErrorLog.name) private errorLogModel: Model<ErrorLogDocument>,
  ) {}

  async create(data: Partial<ErrorLog>) {
    try {
      const created = new this.errorLogModel(data);
      return await created.save();
    } catch (err) {
      console.error('Failed to log error to MongoDB:', err);
    }
  }
}
