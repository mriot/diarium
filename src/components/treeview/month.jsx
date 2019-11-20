import React from 'react';

export default class Month extends React.PureComponent {
  render() {
    return (
       <table>
         <thead>
          <tr>
            <th>Mo</th>
            <th>Di</th>
            <th>Mi</th>
            <th>Do</th>
            <th>Fr</th>
            <th>Sa</th>
            <th>So</th>
          </tr>
         </thead>
         <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td>7</td>
          </tr>
         </tbody>
       </table>
    );
  }
}
