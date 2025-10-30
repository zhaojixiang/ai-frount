import sensors from '@woulsl-tools/sensors';

export const sensClickInitiative = async (val: any = {}) => {
  try {
    sensors?.track('$WebClick', {
      ...val
    });
  } catch (e) {
    reportError(e);
  }
};

export const sensPageView = async (val = {}) => {
  try {
    const values: any = val || {};
    sensors?.track('$pageview', {
      ...values
    });
  } catch (e) {
    reportError(e);
  }
};

export const sensElementView = async (val = {}) => {
  try {
    const values: any = val || {};

    sensors?.track('ElementView', {
      ...values
    });
  } catch (e) {
    reportError(e);
  }
};
