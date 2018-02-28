/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import Messenger from '../src/index';
import MessengerLib from '..';

describe('index', () => {
  test('export', () => {
    expect(Messenger).toBeDefined();
    expect(MessengerLib).toBeDefined();
  });
});
