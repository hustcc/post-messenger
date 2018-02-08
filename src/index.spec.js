/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import Messenger from '.';
import MessengerDist from '..';

describe('index', () => {
  test('export', () => {
    expect(Messenger).toBeDefined();
    expect(MessengerDist).toBeDefined();
  });
});
