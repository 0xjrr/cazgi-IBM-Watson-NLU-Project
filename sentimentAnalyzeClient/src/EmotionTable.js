import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
        return (
            <div>
                {/* {this.props.emotions[0]} */}
                <table className="table table-bordered">
                    <tbody>
                        {
                            Object.entries(this.props.emotions).map((mapentry) => {
                                return (
                                    <tr>
                                        <td>{mapentry[0]}</td>
                                        <td>{mapentry[1]}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }

}
export default EmotionTable;
