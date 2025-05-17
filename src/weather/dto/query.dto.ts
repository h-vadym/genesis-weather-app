import { IsString, IsNotEmpty } from 'class-validator';

export class GetWeatherQueryDto {
  @IsString()
  @IsNotEmpty()
  city: string;
}
