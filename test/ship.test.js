import Ship from '../src/modules/ship';

describe('Ship', () => {
  test('Creating ship of length 3, has hit positions set to "false"', () => {
    const destroyer = Ship(3);
    const expected = [false, false, false];
    expect(destroyer.hitPositions).toEqual(expect.arrayContaining(expected));
  });

  test('Hitting ship of length 3 at position 2 gets registered', () => {
    const destroyer = Ship(3);
    destroyer.hit(1);
    const expected = [false, true, false];
    expect(destroyer.hitPositions).toEqual(expect.arrayContaining(expected));
  });

  test('Ship of length 3 was not hit, isHit should be false', () => {
    const destroyer = Ship(3);
    expect(destroyer.isHit()).toEqual(false);
  });

  test('Hitting ship of length 3 at position 2, isHit should be true', () => {
    const destroyer = Ship(3);
    destroyer.hit(1);
    expect(destroyer.isHit()).toEqual(true);
  });

  test('Ship of length 3 was hit at three positions, isSunk should be true', () => {
    const destroyer = Ship(3);
    destroyer.hit(0);
    destroyer.hit(1);
    destroyer.hit(2);
    expect(destroyer.isSunk()).toEqual(true);
  });

  test('Hitting ship of length 3 at position 2, isSunk should be false', () => {
    const destroyer = Ship(3);
    destroyer.hit(1);
    expect(destroyer.isSunk()).toEqual(false);
  });

  test('Hitting ship of length 3 at position 2, isPositionHit should return true', () => {
    const destroyer = Ship(3);
    destroyer.hit(1);
    expect(destroyer.isPositionHit(1)).toEqual(true);
  });
});
