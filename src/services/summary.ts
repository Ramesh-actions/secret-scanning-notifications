import * as core from '@actions/core';
import { SummaryTableRow } from '@actions/core/lib/summary';
import { SecretScanningAlert } from '../types/common/main';
import * as github from '@actions/github';

export function addToSummary(title: string, alerts: SecretScanningAlert[]) {
  const headers = ['Alert Number', 'Secret State', 'Secret Type', 'HTML URL', 'Org Owner', 'Repo Owner'];
  const rows = alerts.map(alert => [
    alert.number.toString(),
    alert.state,
    alert.secret_type,
    alert.html_url,
    alert.org_owner, // Directly using the org_owner property
    alert.repo_owner, // Directly using the repo_owner property
  ]);

  core.summary
    .addHeading(title)
    .addTable([
      headers.map(header => ({ data: header, header: true })),
      ...rows,
    ] as SummaryTableRow[])
    .addBreak();
}

export async function writeSummary() {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  const repoOwner = github.context.repo.owner;

  let orgOwner = repoOwner;
  try {
    const orgResponse = await octokit.rest.orgs.get({ org: repoOwner });
    orgOwner = orgResponse.data.login;
  } catch (error) {
    core.info('Repository owner is not an organization');
  }

  const summary = core.summary
    .addHeading('Org Owner')
    .addText(orgOwner)
    .addHeading('Repo Owner')
    .addText(repoOwner);
  
    core.summary.write();
    core.setOutput('summary', summary); // set the summary as an output
  
    core.info(`[✅] Action summary written`);
  }

export function getSummaryMarkdown() {
  return core.summary.stringify();
}
