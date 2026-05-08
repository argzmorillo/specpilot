import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AnalyzeTextDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  text!: string;
}
