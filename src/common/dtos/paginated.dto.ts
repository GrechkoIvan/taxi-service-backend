import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMetaDto {
  @ApiProperty({ description: 'Всего элементов', example: 125 })
  total!: number;

  @ApiProperty({ description: 'Текущая страница', example: 2 })
  page!: number;

  @ApiProperty({ description: 'Лимит на страницу', example: 10 })
  limit!: number;

  @ApiProperty({ description: 'Смещение', example: 10 })
  offset!: number;

  @ApiProperty({ description: 'Есть ли следующая страница', example: true })
  hasMore!: boolean;
}

export class PaginatedDto<T> {
  @ApiProperty({ description: 'Список элементов', isArray: true, type: Object })
  data!: T[];

  @ApiProperty({ description: 'Мета-информация', type: PaginatedMetaDto })
  meta!: PaginatedMetaDto;
}
