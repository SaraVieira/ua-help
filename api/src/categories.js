export const categoriesObj = {
  army: {
    title: 'Supplies for the military',
    slug: 'army',
  },
  'medical-supplies': {
    title: 'Medical supplies',
    slug: 'medical-supplies',
  },
  'volunteer-help': {
    title: 'Helping the volunteers',
    slug: 'volunteer-help',
  },
  'veteran-help': {
    title: 'Helping the veterans',
    slug: 'veteran-help',
  },
  children: {
    title: 'Helping Children',
    slug: 'children',
  },
  'vulnerable-groups': {
    title: 'Vulnerable Groups',
    slug: 'vulnerable-groups',
  },
  journalism: {
    title: 'Journalism',
    slug: 'journalism',
  },
  'humanitarian-aid': {
    title: 'Humanitarian Aid',
    slug: 'humanitarian-aid',
  },
}

export const categories = Object.keys(categoriesObj).reduce(
  (acc, curr, idx) => {
    acc[curr] = {
      ...categoriesObj[curr],
      id: idx.toString(),
    }

    return acc
  },
  {},
)
