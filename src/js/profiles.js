import { openDB } from 'idb'

import { $, $$, appendTo, createElement } from './dom-utils'

const db = openDB('profiles-store', 1, {
  upgrade (db) {
    db.createObjectStore('profiles', { 
        keyPath: 'id', 
        autoIncrement: true, 
    })
  },
})

const listProfiles = async () => (await db).getAll('profiles')
const getProfile = async (id) => (await db).get('profiles', parseInt(id))

const createProfile = async (profile) => (await db).add('profiles', profile)

const simplifyReasons = () => {
  $$('#reason-fieldset label').forEach(label => {
    const tooltip = label.innerText
    label.innerText = label.getAttribute('for').split('-')[1]
    label.title = tooltip
    label.setAttribute('class', 'btn btn-primary check-label')
  })
}

const applyProfile = async (id) => {
  const profile = await getProfile(id)

  if (profile) {
      Object.keys(profile)
        .filter(key => key != 'id' 
          && key != 'datesortie' 
          && key != 'heuresortie')
        .forEach(key => {
          const field = $(`#field-${key}`)

          if (field) {
            field.value = profile[key]
          }
        })

    //skip to the important fields
    location.href = '#field-datesortie'
  }
}

const clearForm = () => console.warn('not implemented')

export const prepareProfiles = async () => {
  
  $('#field-profile').addEventListener(
    'change', 
    event => event.target.value == 0 
      ? clearForm()
      : applyProfile(event.target.value)
  )

  const appendProfileOption = (id, name) => {
    appendTo($('#field-profile'))(
      createElement('option', { value: id, text: name })
    )
  }

  ;[{id: 0, firstname: '---'}, ...(await listProfiles())]
    .forEach(p => appendProfileOption(p.id, p.firstname))
    
  simplifyReasons()
}
