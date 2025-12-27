/**
 * useCountdown - 카운트다운 타이머 커스텀 훅
 * 프로모션 종료일까지 남은 시간을 계산합니다.
 */

import { useState, useEffect, useMemo } from 'react';

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

/**
 * 목표 날짜까지 남은 시간을 계산하는 커스텀 훅
 * @param targetDate - 목표 날짜 (Date 객체 또는 ISO 문자열)
 * @returns CountdownResult - 남은 일, 시, 분, 초 및 만료 여부
 */
export const useCountdown = (targetDate: Date | string): CountdownResult => {
  // 목표 날짜를 Date 객체로 변환
  const targetTime = useMemo(() => {
    return typeof targetDate === 'string' ? new Date(targetDate).getTime() : targetDate.getTime();
  }, [targetDate]);

  // 남은 시간 계산 함수
  const calculateTimeLeft = (): CountdownResult => {
    // SSR 안전 체크
    if (typeof window === 'undefined') {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
        totalSeconds: 0,
      };
    }

    const now = Date.now();
    const difference = targetTime - now;

    // 이미 만료된 경우
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        totalSeconds: 0,
      };
    }

    // 남은 시간 계산 (음수 방지)
    const totalSeconds = Math.max(0, Math.floor(difference / 1000));
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      totalSeconds,
    };
  };

  // 상태 초기화
  const [timeLeft, setTimeLeft] = useState<CountdownResult>(calculateTimeLeft);

  // 1초마다 업데이트
  useEffect(() => {
    // 초기 계산
    setTimeLeft(calculateTimeLeft());

    // 인터벌 설정
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // 만료되면 인터벌 정리
      if (newTimeLeft.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    // 클린업
    return () => clearInterval(timer);
  }, [targetTime]);

  return timeLeft;
};

/**
 * 시간을 2자리 문자열로 포맷팅
 * @param value - 숫자 값
 * @returns 2자리 문자열 (예: 05, 12)
 */
export const formatTimeUnit = (value: number): string => {
  return value.toString().padStart(2, '0');
};

/**
 * 카운트다운 결과를 문자열로 포맷팅
 * @param countdown - CountdownResult
 * @param includeSeconds - 초 포함 여부 (기본: true)
 * @returns 포맷팅된 문자열 (예: "2일 05:30:15")
 */
export const formatCountdown = (
  countdown: CountdownResult,
  includeSeconds: boolean = true
): string => {
  if (countdown.isExpired) {
    return '종료됨';
  }

  const { days, hours, minutes, seconds } = countdown;
  
  if (days > 0) {
    if (includeSeconds) {
      return `${days}일 ${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
    }
    return `${days}일 ${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}`;
  }
  
  if (includeSeconds) {
    return `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
  }
  return `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}`;
};

export default useCountdown;

