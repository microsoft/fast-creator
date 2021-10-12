# Process

This document outlines the release process for the Creator application. It details short and long term planning, the relationship between the Creator application repository and the FAST tooling repository and the participants involved and their roles.

## Participants

- Jane Chu (@janechu)
- William Wagner (@williamw2)
- Rob Eisenberg (@EisenbergEffect)
- Brian Heston (@bheston)
- Jason Falk
- Aaron Wentzel (@awentzel)

## Roles and responsibilities

- Jason Falk and Rob Eisenberg as product managers will determine priority.
- Anyone in the participants list can suggest a new idea.
- Anyone suggesting a new idea must be involved in the requirements gathering for the issue(s) generated from that idea.
- @janechu or @williamw2 will handle issue creation from the idea, see [planning a feature](#planning-a-feature) section below, as well as conducting user testing.

## Planning cadence

There are two main planning cadences, a short term weekly planning cadence (similar to the current architecture and tooling planning, which will have a short high-level summary from the earlier tooling meeting) and a longer term cadence so that the Creator can move through such stages as alpha, beta, release candidate and so forth. The longer term cadences will become milestones and the work will be done in a `release` branch.

## Planning a release

- A new release should start being planned approximately 2 weeks before the end of the previous release, check the estimated amount of time remaining during the weekly planning meetings.
- User testing will be planned at the beginning of the release.
- A milestone will be created in the fast-creator repository and a milestone with the same name will be created in the fast-tooling repository.
    - The name of the milestone should be a simple number, such as "Release 1".
    - The release description in the fast-creator repository should include the release version e.g. "alpha".
- Identify and place all new ideas and features for the release into a milestone
    - A release does not need to include a major change, but should include a set of features and bugs in a coherent grouping or based on priority.
- When all issues placed in a milestone for a release are resolved that `release` branch should be merged to the `main` branch.
    - This should result in a publish to production.
    - The changelog for new releases should be generated via beachball.
        - This may at some point become part of the app, similar to how other apps have a notification with "what's new in this version" pop up.
- The milestone for the release is closed.

## Planning a feature

Feature planning includes converting `idea` issues into issues, gathering requirements, writing the issues and securing buy-in from the designer(s) or developer(s) assigned to do the work.

### Capturing new ideas

- Ideas go into the Creator repository and tagged with `idea` initially.
- Once an idea has been determined it will go into a milestone, requirement gathering will begin.

### Requirements

- For each new idea that will become a feature or set of features, requirements will be gathered from the respective parties (see [participants list](#participants), however the idea issue will include a subset of users and the user who proposed the idea will be marked with "proposal").

### Creating feature issues

1. Identify all issues and sub-issues, if there are multiple tasks per feature, create a master issue that tracks all sub issues.
2. Feature issues should contain a time estimate.
3. Feature issues should contain a list of requirements for the issue.
4. Any issues that require design work should have a `status:blocked` tag if the design is not completed and be linked to the related design issue.
5. Design issues should be tagged with `visual design` and cross linked to the related feature work.
6. As most issues will go into the FAST tooling repository, create an open issue in the Creator application that tracks these issues with an aggregate of their estimates.
    - Title this issue "Milestone #1 Issue Tracker".

### Completing a design feature issue

- Completing a design issue
    - Provide a link to the design file
        - Link to the figma file in Creator if the issue is part of the Creator repository.
        - Link to the figma file in the Creator release issue tracker under the linked issue if the issue is part of the FAST tooling repository and provide a `.png` file for the FAST tooling issue.
    - Get sign off from the developer developing the related feature issue.
    - Close the issue.
    - Remove the `status:blocked` tag from related the developer feature issue
- Completing a developer issue.
    - Write a spec markdown file and complete a pull request with this spec.
        - Link but do not close feature issue using the phrasing "relating to #1234" in the pull request.
    - Create a pull request for the feature following standard procedure (a check list will be provided in the pull request template).
        - Ensure any updates are made to workflows that may be affected.
        - Ensure unit testing covers all possible cases that can be tested in the Mocha/Chai test environment and all other tests are done using the integration tests as part or a subset of a workflow test.

### User testing

During a release 2 users will be consulted for user testing. This will come in the form of 2 separate meetings in which the user will be prompted with a task and recorded during the session. The video will then be posted to this [channel](https://msit.microsoftstream.com/channel/ca8b0840-98dc-948e-a12d-f1ec27b5c313) and sent to product managers for review. The bugs and features resulting from the user testing will be filed as issues in either FAST Creator or FAST Tooling by @janechu. The next release milestone will be created at this time to place bugs and/or features into.

### Communication and Demo-worthiness

- Have a set of workflows that are expected to work at any time for demos to leadership, these should ideally be E2E tested as user critical path workflows and part of the build gate.
- Should a workflow necessarily change due to updates to the Creator/tooling, all members of the tooling team as well as Jason Falk should be made aware of the change.
