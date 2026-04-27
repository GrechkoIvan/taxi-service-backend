import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ErrorLogDocument = ErrorLog & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class ErrorLog {
  @Prop({ type: Number, required: false })
  userId?: number;

  @Prop({ type: String, required: false })
  role?: string;

  @Prop({ type: String, required: false })
  method?: string;

  @Prop({ type: String, required: false })
  path?: string;

  @Prop({ type: Number, required: false })
  statusCode?: number;

  @Prop({ type: String, required: false })
  message?: string;

  @Prop({ type: String, required: false })
  stack?: string;
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog);
