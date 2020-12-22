const hello = require('../hello');

it('第一个单元测试', () => {
    expect(hello()).toBe('hello world');
});