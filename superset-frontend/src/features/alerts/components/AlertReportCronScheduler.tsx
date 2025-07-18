/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { useState, useCallback, FocusEvent, FC } from 'react';

import { t, useTheme } from '@superset-ui/core';

import {
  Input,
  CronPicker,
  Select,
  type CronError,
} from '@superset-ui/core/components';
import { StyledInputContainer } from '../AlertReportModal';

export interface AlertReportCronSchedulerProps {
  value: string;
  onChange: (change: string) => any;
}

enum ScheduleType {
  Picker = 'picker',
  Input = 'input',
}

const SCHEDULE_TYPE_OPTIONS = [
  {
    label: t('Recurring (every)'),
    value: ScheduleType.Picker,
  },
  {
    label: t('CRON Schedule'),
    value: ScheduleType.Input,
  },
];

export const AlertReportCronScheduler: FC<AlertReportCronSchedulerProps> = ({
  value,
  onChange,
}) => {
  const theme = useTheme();
  const [scheduleFormat, setScheduleFormat] = useState<ScheduleType>(
    ScheduleType.Picker,
  );

  const customSetValue = useCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    [onChange],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  const handlePressEnter = useCallback(() => {
    onChange(value || '');
  }, [onChange, value]);

  const [error, onError] = useState<CronError>();

  return (
    <>
      <StyledInputContainer>
        <div className="control-label">
          {t('Schedule type')}
          <span className="required">*</span>
        </div>
        <div className="input-container">
          <Select
            ariaLabel={t('Schedule type')}
            placeholder={t('Schedule type')}
            onChange={(e: ScheduleType) => {
              setScheduleFormat(e);
            }}
            value={scheduleFormat}
            options={SCHEDULE_TYPE_OPTIONS}
          />
        </div>
      </StyledInputContainer>

      <StyledInputContainer data-test="input-content" className="styled-input">
        <div className="control-label">
          {t('Schedule')}
          <span className="required">*</span>
        </div>
        {scheduleFormat === ScheduleType.Input && (
          <Input
            type="text"
            name="crontab"
            style={error ? { borderColor: theme.colorError } : {}}
            placeholder={t('CRON expression')}
            value={value}
            onBlur={handleBlur}
            onChange={e => customSetValue(e.target.value)}
            onPressEnter={handlePressEnter}
          />
        )}
        {scheduleFormat === ScheduleType.Picker && (
          <CronPicker
            clearButton={false}
            value={value}
            setValue={customSetValue}
            displayError={scheduleFormat === ScheduleType.Picker}
            onError={onError}
          />
        )}
      </StyledInputContainer>
    </>
  );
};
