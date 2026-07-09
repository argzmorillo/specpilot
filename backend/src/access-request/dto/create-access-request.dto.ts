import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAccessRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
