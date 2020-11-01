import { openDB } from 'idb'

import { $, appendTo, createElement } from './dom-utils'

const db = openDB('profiles-store', 1, {
  upgrade (db) {
    db.createObjectStore('profiles', { 
        keyPath: 'id', 
        autoIncrement: true, 
    })
  },
})

const listProfiles = async () => (await db).getAll('profiles')
const getProfile = async (id) => (await db).get('profiles').get(id)

export const createProfile = async (profile) => {
  (await db).add('profiles', profile)
}

export const applyProfile = async (id) => {
  const profile = (await getProfile(id))

  console.log(profile)

  if (profile) {
      Object.keys(profile)
        .filter(key => key != 'id' 
          && key != 'datesortie' 
          && key != 'heuresortie')
        .forEach(key => {
          $(`#field-${key}`).value = profile[key]
        })
  }
}

export const prepareProfiles = async () => {
  
  $('#field-profile').addEventListener(
    'change', 
    event => applyProfile(event.target.value)
  )

  const appendProfileOption = (id, name) => {
    appendTo($('#field-profile'))(
      createElement('option', { value: id, text: name })
    )
  }

  (await listProfiles())
    .forEach(p => appendProfileOption(p.id, p.firstname))
}
