## Branching Naming Convention - Quick Legend

<table>
  <thead>
    <tr>
      <th>Instance</th>
      <th>Branch</th>
      <th>Description, Instructions, Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Stable</td>
      <td>stable</td>
      <td>Accepts merges from Working and Hotfixes</td>
    </tr>
    <tr>
      <td>Working</td>
      <td>develop</td>
      <td>Accepts merges from Features and Hotfixes/Issues</td>
    </tr>
    <tr>
      <td>Features</td>
      <td><b>your-name</b>/<b>feature</b>/<b>feature-name</b></td>
      <td>Always branch off HEAD of Working (create from develop)</td>
    </tr>
    <tr>
      <td>Hotfix/Issues</td>
      <td><b>your-name</b>/<b>fix</b>/<b>fix-name</b></td>
      <td>Always branch off Stable (create from master)</td>
    </tr>
  </tbody>
</table>
