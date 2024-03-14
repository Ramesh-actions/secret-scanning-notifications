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
    alert.org_owner,
    alert.repo_owner,
  ]);

  // Replace core.summary with the actual object or method that has addHeading, addTable, and addBreak methods
  // For example, if you're using a custom library that provides these methods, use that instead of core.summary
  // core.summary
  //   .addHeading(title)
  //   .addTable([
  //     headers.map(header => ({ data: header, header: true })),
  //     ...rows,
  //   ] as SummaryTableRow[])
  //   .addBreak();
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
    await octokit.rest.orgs.get({ org: repoOwner });
  } catch (error: any) {
    core.setFailed(`Failed to get organization: ${error.message}`);
  }

  // Add repoOwner to the summary
  // Replace core.summary with the actual object or method that has addHeading, addField, and addBreak methods
  // For example, if you're using a custom library that provides these methods, use that instead of core.summary
  // core.summary
  //   .addHeading('Repo Owner')
  //   .addField('Owner', repoOwner) // replace addField with the actual method name
  //   .addBreak();
}

export function getSummaryMarkdown() {
  // Replace core.summary with the actual object or method that provides the stringify method
  // return core.summary.stringify();
}

// Call the function to avoid 'never read' error
writeSummary();