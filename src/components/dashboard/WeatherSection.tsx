// src/components/employee/WeatherSection.tsx
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiFog,
  WiRain,
  WiShowers,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import { useUserLocation } from "../../hooks/useUserLocation";
import { useWeather, type WeatherResponse } from "../../hooks/useWeather";

// Fallback: Copenhagen
const DEFAULT_LAT = 55.6761;
const DEFAULT_LON = 12.5683;

const baseDescriptionFromCode = (code: number) => {
  if (code === 0) return "Clear sky";
  if ([1, 2].includes(code)) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown conditions";
};

const iconFromCode = (code: number) => {
  if ([95, 96, 99].includes(code)) return <WiThunderstorm />;
  if ([61, 63, 65, 66, 67].includes(code)) return <WiRain />;
  if ([80, 81, 82].includes(code)) return <WiShowers />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <WiSnow />;
  if ([45, 48].includes(code)) return <WiFog />;
  if (code === 0) return <WiDaySunny />;
  if ([1, 2].includes(code)) return <WiDayCloudy />;
  if (code === 3) return <WiCloudy />;
  return <WiCloudy />;
};

const pickTodaySnapshot = (data: WeatherResponse) => {
  if (!data.current_weather) return null;

  const current = data.current_weather;
  const hourly = data.hourly;
  const daily = data.daily;

  let rainChance: number | null = null;
  let cloudCover: number | null = null;

  if (
    hourly?.time &&
    hourly.precipitation_probability &&
    hourly.cloudcover &&
    hourly.time.length === hourly.precipitation_probability.length &&
    hourly.time.length === hourly.cloudcover.length
  ) {
    const idx = hourly.time.indexOf(current.time);
    if (idx !== -1) {
      rainChance = hourly.precipitation_probability[idx] ?? null;
      cloudCover = hourly.cloudcover[idx] ?? null;
    }
  }

  // Fallback: daily max rain prob for today
  const dailyRainMax =
    daily.precipitation_probability_max?.[0] ?? null;
  if (rainChance == null && dailyRainMax != null) {
    rainChance = dailyRainMax;
  }

  return {
    temperature: current.temperature,
    windSpeed: current.windspeed,
    weatherCode: current.weathercode,
    rainChance,
    cloudCover,
    isDay: current.is_day === 1,
  };
};

const WeatherSection = () => {
  // 1) Get user location (or fallback)
  const { lat, lon, loading: locLoading } = useUserLocation();

  const finalLat = lat ?? DEFAULT_LAT;
  const finalLon = lon ?? DEFAULT_LON;

  // 2) Get weather for that location
  const {
    data,
    loading: weatherLoading,
    error: weatherError,
  } = useWeather({ lat: finalLat, lon: finalLon, days: 1 });

  const loading = locLoading || weatherLoading;
  const error = weatherError;
  const today = data ? pickTodaySnapshot(data) : null;

  return (
    <Box
      p={6}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="md"
      shadow="sm"
    >
      <Heading size="md" mb={4} color="gray.700">
        Today&apos;s Weather
      </Heading>

      {loading && (
        <HStack spacing={3}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.600">
            Fetching current weather near you...
          </Text>
        </HStack>
      )}

      {!loading && error && (
        <Alert status="error" variant="subtle" rounded="md">
          <AlertIcon />
          <Text fontSize="sm">{error}</Text>
        </Alert>
      )}

      {!loading && !error && today && (
        <VStack align="start" spacing={3}>
          <HStack align="center" spacing={4}>
            <Box fontSize="3xl" color="blue.500">
              {iconFromCode(today.weatherCode)}
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="2xl" color="gray.700">
                {today.temperature.toFixed(1)}°C
              </Text>
              <Text fontSize="sm" color="gray.700">
                {baseDescriptionFromCode(today.weatherCode)}
              </Text>
            </VStack>
          </HStack>

          <Text fontSize="sm" color="gray.700">
            Chance of rain:{" "}
            {today.rainChance != null ? `${today.rainChance}%` : "–"}
          </Text>

          <Text fontSize="sm" color="gray.700">
            Wind: {today.windSpeed.toFixed(1)} m/s
          </Text>
        </VStack>
      )}

      {!loading && !error && !today && (
        <Text fontSize="sm" color="gray.600">
          Weather data is currently unavailable.
        </Text>
      )}
    </Box>
  );
};

export default WeatherSection;
