import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningInformationEditView from 'components/screenings/ScreeningInformationEditView'
import ScreeningInformationShowView from 'components/screenings/ScreeningInformationShowView'

export default class ScreeningInformationCardView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: this.props.mode,
    }
    this.onEdit = this.onEdit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.fields = Immutable.fromJS([
      'assignee',
      'communication_method',
      'ended_at',
      'name',
      'started_at',
    ])
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  onSave() {
    return this.props.onSave(this.fields).then(() => {
      this.setState({mode: 'show'})
    })
  }

  onCancel() {
    this.setState({mode: 'show'})
    this.props.onCancel(this.fields)
  }

  render() {
    const {mode} = this.state
    const allprops = {
      edit: {
        onCancel: this.onCancel,
        onChange: this.props.onChange,
        onSave: this.onSave,
        screening: this.props.screening,
      },
      show: {
        onEdit: this.onEdit,
        screening: this.props.screening,
      },
    }
    const ScreeningInformationView = (mode === 'edit') ? ScreeningInformationEditView : ScreeningInformationShowView
    const props = allprops[mode]
    return <ScreeningInformationView {...props} />
  }
}

ScreeningInformationCardView.propTypes = {
  mode: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}

