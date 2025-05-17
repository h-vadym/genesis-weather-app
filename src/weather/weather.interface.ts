export interface WeatherReqResponse {
  temperature: number;
  humidity: number;
  description: string;
}

export interface WeatherApiResponse {
  data: {
    current: {
      temp_c: number;
      humidity: number;
      condition: {
        text: string;
      };
    };
  };
}
