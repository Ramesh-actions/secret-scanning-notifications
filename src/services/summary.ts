import * as core from '@actions/core';
import { SummaryTableRow } from '@actions/core/lib/summary';
import { SecretScanningAlert } from '../types/common/main';
import * as github from '@actions/github';
import { context } from '@actions/github';


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

async function writeSummary() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  
  if (!GITHUB_TOKEN) {
    core.setFailed('GITHUB_TOKEN not found in environment');
    return;
  }

  const octokit = github.getOctokit(GITHUB_TOKEN);
  const repoOwner = github.context.repo.owner;

  try {
    // Removed unused orgOwner variable and directly used repoOwner
    await octokit.rest.orgs.get({ org: repoOwner });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Failed to get organization: ${error.message}`);
    } else {
      core.setFailed(`Failed to get organization: ${error}`);
    }
  }

  const summary = `Repo Owner: ${repoOwner}`;

  // Write the summary to the console
  console.log(summary);

  // Or return the summary
  return summary;
}

export function getSummaryMarkdown() {
  return core.summary.stringify();
}

// Call the function to avoid 'never read' error
writeSummary();