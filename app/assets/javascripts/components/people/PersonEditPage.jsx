import * as personActions from 'actions/personActions'
import AddressesEditView from 'components/people/AddressesEditView'
import DateField from 'components/common/DateField'
import EthnicityEditView from 'components/people/EthnicityEditView'
import GENDERS from 'Genders'
import Immutable from 'immutable'
import InputField from 'components/common/InputField'
import LANGUAGES from 'Languages'
import NAME_SUFFIXES from 'NameSuffixes'
import PhoneNumbersEditView from 'components/people/PhoneNumbersEditView'
import RacesEditView from 'components/people/RacesEditView'
import PropTypes from 'prop-types'
import React from 'react'
import Select from 'react-select'
import SelectField from 'components/common/SelectField'
import selectOptions from 'utils/selectHelper'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

export class PersonEditPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      person: Immutable.fromJS({
        first_name: null,
        last_name: null,
        name_suffix: null,
        gender: null,
        date_of_birth: null,
        ssn: null,
        languages: [],
        races: [],
      }),
    }
    this.setField = this.setField.bind(this)
    this.update = this.update.bind(this)
  }

  componentDidMount() {
    const personId = this.props.params.id
    this.props.actions.fetchPerson(personId)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({person: nextProps.person})
  }

  update() {
    this.props.actions.updatePerson(this.state.person.toJS())
      .then(() => this.show())
  }

  show() {
    const {params} = this.props
    this.props.router.push({
      pathname: `/people/${params.id}`,
    })
  }

  setField(fieldSeq, value) {
    const person = this.state.person.setIn(fieldSeq, value)
    this.setState({person: person})
  }

  render() {
    const {params} = this.props
    const {person} = this.state
    return (
      <div className='card edit double-gap-top'>
        <div className='card-header'>
          <span>Edit Basic Demographics Card</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <InputField
              gridClassName='col-md-3'
              id='first_name'
              label='First Name'
              value={person.get('first_name') || ''}
              onChange={(event) => this.setField(['first_name'], event.target.value)}
            />
            <InputField
              gridClassName='col-md-3'
              id='middle_name'
              label='Middle Name'
              value={person.get('middle_name') || ''}
              onChange={(event) => this.setField(['middle_name'], event.target.value)}
            />
            <InputField
              gridClassName='col-md-3'
              id='last_name'
              label='Last Name'
              value={person.get('last_name') || ''}
              onChange={(event) => this.setField(['last_name'], event.target.value)}
            />
            <SelectField
              gridClassName='col-md-3'
              id='name_suffix'
              label='Suffix'
              value={person.get('name_suffix') || ''}
              onChange={(event) => this.setField(['name_suffix'], event.target.value || null)}
            >
              <option key='' />
              {Object.keys(NAME_SUFFIXES).map((item) => <option key={item} value={item}>{NAME_SUFFIXES[item]}</option>)}
            </SelectField>
          </div>
           <PhoneNumbersEditView
             phoneNumbers={this.state.person.get('phone_numbers') || Immutable.List()}
             onChange={(phoneNumbers) => this.setField(['phone_numbers'], phoneNumbers)}
           />
          <div className='row'>
            <DateField
              gridClassName='col-md-6'
              id='date_of_birth'
              label='Date of birth'
              value={person.get('date_of_birth') || ''}
              onChange={(event) => this.setField(['date_of_birth'], event.target.value)}
            />
            <SelectField
              gridClassName='col-md-6'
              id='gender'
              label='Gender'
              value={person.get('gender') || ''}
              onChange={(event) => this.setField(['gender'], event.target.value || null)}
            >
              <option key='' />
              {Object.keys(GENDERS).map((item) => <option key={item} value={item}>{GENDERS[item]}</option>)}
            </SelectField>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='languages'>Language(s)</label>
              <Select
                multi
                inputProps={{id: 'languages'}}
                options={selectOptions(LANGUAGES)}
                value={person.get('languages').toJS()}
                onChange={(languages) => this.setField(
                  ['languages'],
                  Immutable.List(languages.map((language) => language.value)))
                }
              />
            </div>
          </div>
          <div className='row'>
            <InputField
              gridClassName='col-md-6'
              id='ssn'
              label='Social security number'
              value={person.get('ssn') || ''}
              onChange={(event) => this.setField(['ssn'], event.target.value)}
            />
          </div>
          <AddressesEditView
            addresses={this.state.person.get('addresses') || Immutable.List()}
            onChange={(addresses) => this.setField(['addresses'], addresses)}
          />
          <RacesEditView
            races={this.state.person.get('races') || Immutable.List()}
            onChange={(races) => this.setField(['races'], races)}
          />
          <EthnicityEditView
            ethnicity={this.state.person.get('ethnicity') || Immutable.Map()}
            onChange={(ethnicity) => this.setField(['ethnicity'], ethnicity)}
          />
          <div className='row'>
            <div className='centered'>
              <button className='btn btn-primary' onClick={this.update} >Save</button>
              <Link className='btn btn-default' to={`/people/${params.id}`}>Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

PersonEditPage.propTypes = {
  actions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
}

function mapStateToProps(state, ownProps) {
  return {
    person: state.person,
    router: ownProps.router,
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(personActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonEditPage)
