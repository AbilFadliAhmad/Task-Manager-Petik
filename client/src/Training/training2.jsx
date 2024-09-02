import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useState } from 'react'

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]

const  Training = ()=> {
  const [selectedPeople, setSelectedPeople] = useState([people[1]])

  return (
    <Listbox value={selectedPeople} onChange={setSelectedPeople} multiple>
      <ListboxButton>{selectedPeople.map((person) => person.name).join(', ')}</ListboxButton>
      <ListboxOptions anchor="bottom">
        {people.map((person) => (
          <ListboxOption key={person.id} value={person} className="data-[focus]:bg-blue-100">
            {person.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}

export default Training