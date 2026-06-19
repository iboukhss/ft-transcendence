type query = {
  skills?: string[]
  location?: string[]
  categories?: string[]
  workplace?: string[]
  salaryStart?: number
  salaryEnd?: number
  page?: number
}

async function buildSalaryEndquery(salaryEnd: number) {
  if (!salaryEnd) {
    console.log('huhu')
    return ('')
  }
  console.log('hihi')
  return (`salaryEnd=${salaryEnd}&`)
}

async function buildPagequery(page: number, includes_page: boolean) {
  if (!page || includes_page === false)
    return ('')
  return (`page=${page}`)
}

async function buildSalaryStartquery(salaryStart: number) {
  if (!salaryStart)
    return ('')
  return (`salaryStart=${salaryStart}&`)
}

async function buildworkplacequery(workplace: string[]) {
  if (!workplace || workplace.length <= 0)
    return ('')

  let workplace_query = 'workplace='
  for (const work of workplace) {
    workplace_query += `${work},`
  }
  if (workplace_query[workplace.length - 1] === ',')
    workplace_query = workplace_query.substring(0, workplace_query.length - 1)
  return (workplace_query + '&')
}

async function buildCategoriesquery(categories: string[]) {
  if (!categories || categories.length <= 0)
    return ('')

  let category_query = 'categories='
  for (const category of categories) {
    category_query += `${category},`
  }
  if (category_query[category_query.length - 1] === ',')
    category_query = category_query.substring(0, category_query.length - 1)
  return (category_query + '&')
}

async function buildLocationsquery(locations: string[]) {
  if (!locations || locations.length <= 0)
    return ('')

  let location_query = 'location='
  for (const location of locations) {
    location_query += `${location},`
  }
  if (location_query[location_query.length - 1] === ',')
    location_query = location_query.substring(0, location_query.length - 1)
  return (location_query + '&')
}

async function buildskillsquery(skills: string[]) {
  if (!skills || skills.length <= 0)
    return ('')
  let skill_query = 'skills='
  for (const skill of skills) {
    skill_query += `${skill},`
  }
  if (skill_query[skill_query.length - 1] === ',')
    skill_query = skill_query.substring(0, skill_query.length - 1)
  return (skill_query + '&')
}
export async function urlQueryBuilder(data: query, includePage: boolean, urlStart: string) {
  const skills = await buildskillsquery(data.skills!)
  const location = await buildLocationsquery(data.location!)
  const categoriy = await buildCategoriesquery(data.categories!)
  const workplace = await buildworkplacequery(data.workplace!)
  const salaryStart = await buildSalaryStartquery(data.salaryStart!)
  const salaryEnd = await buildSalaryEndquery(data.salaryEnd!)
  const page = await buildPagequery(data.page!, includePage)

  let urlQuery = `${urlStart}?${skills}${location}${categoriy}${workplace}${salaryStart}${salaryEnd}${page}`

  if (urlQuery[urlQuery.length - 1] === '&' || urlQuery[urlQuery.length - 1] === '?')
    urlQuery = urlQuery.substring(0, urlQuery.length - 1)
  return (urlQuery)
}
