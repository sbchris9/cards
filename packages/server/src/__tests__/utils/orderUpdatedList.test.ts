import { OrderedResource } from '../../entity/abstract/OrderedResource';
import {
  orderInsert,
  orderRemove,
  orderReposition
} from '../../utils/orderUpdatedList';

class OrderedAnimal extends OrderedResource {
  name: string;
}

const createAnimal = (name: string, position: number) => {
  const animal = new OrderedAnimal();
  animal.name = name;
  animal.position = position;
  return animal;
};

const getAnimals = (): OrderedAnimal[] => [
  createAnimal('Cat', 0),
  createAnimal('Dog', 1),
  createAnimal('Turtle', 2)
];

describe('orderInsert', () => {
  it('should reorder on insert correctly', () => {
    const animals = getAnimals();
    const changed = orderInsert<OrderedAnimal>(
      animals,
      createAnimal('Tiger', 1)
    );
    expect(changed).toEqual([
      { name: 'Dog', position: 2 },
      { name: 'Turtle', position: 3 }
    ]);
  });
  it('should reorder on insert correctly', () => {
    const animals = getAnimals();
    const changed = orderInsert<OrderedAnimal>(
      animals,
      createAnimal('Tiger', 0)
    );
    expect(changed).toEqual([
      { name: 'Cat', position: 1 },
      { name: 'Dog', position: 2 },
      { name: 'Turtle', position: 3 }
    ]);
  });
  it('should reorder on insert correctly', () => {
    const animals = getAnimals();
    const changed = orderInsert<OrderedAnimal>(
      animals,
      createAnimal('Tiger', 3)
    );
    expect(changed).toEqual([]);
  });
});

describe('orderRemove', () => {
  it('should reorder on remove correctly', () => {
    const animals = getAnimals();
    const changed = orderRemove<OrderedAnimal>(animals, animals[1]);
    expect(changed).toEqual([{ name: 'Turtle', position: 1 }]);
  });
  it('should reorder on remove correctly', () => {
    const animals = getAnimals();
    const changed = orderRemove<OrderedAnimal>(animals, animals[2]);
    expect(changed).toEqual([]);
  });
  it('should reorder on remove correctly', () => {
    const animals = getAnimals();
    const changed = orderRemove<OrderedAnimal>(animals, animals[0]);
    expect(changed).toEqual([
      { name: 'Dog', position: 0 },
      { name: 'Turtle', position: 1 }
    ]);
  });
});

describe('orderReposition', () => {
  const getAnimals = (): OrderedAnimal[] => [
    createAnimal('Cat', 0),
    createAnimal('Dog', 1),
    createAnimal('Turtle', 2),
    createAnimal('Tiger', 3),
    createAnimal('Rat', 4)
  ];

  it('should reorder on reposition correctly', () => {
    const animals = getAnimals();
    const changed = orderReposition(animals, animals[1], 3);
    expect(changed).toEqual([
      { name: 'Turtle', position: 1 },
      { name: 'Tiger', position: 2 }
    ]);
  });

  it('should reorder on reposition correctly', () => {
    const animals = getAnimals();
    const changed = orderReposition(animals, animals[0], 1);
    expect(changed).toEqual([{ name: 'Dog', position: 0 }]);
  });

  it('should reorder on reposition correctly', () => {
    const animals = getAnimals();
    const changed = orderReposition(animals, animals[0], 4);
    expect(changed).toEqual([
      { name: 'Dog', position: 0 },
      { name: 'Turtle', position: 1 },
      { name: 'Tiger', position: 2 },
      { name: 'Rat', position: 3 }
    ]);
  });

  // Backwards

  it('should reorder on reposition correctly', () => {
    const animals = getAnimals();
    const changed = orderReposition(animals, animals[3], 1);
    expect(changed).toEqual([
      { name: 'Dog', position: 2 },
      { name: 'Turtle', position: 3 }
    ]);
  });

  it('should reorder on reposition correctly', () => {
    const animals = getAnimals();
    const changed = orderReposition(animals, animals[1], 0);
    expect(changed).toEqual([{ name: 'Cat', position: 1 }]);
  });

  it('should reorder on reposition correctly', () => {
    const animals = getAnimals();
    const changed = orderReposition(animals, animals[4], 0);
    expect(changed).toEqual([
      { name: 'Cat', position: 1 },
      { name: 'Dog', position: 2 },
      { name: 'Turtle', position: 3 },
      { name: 'Tiger', position: 4 }
    ]);
  });
});
