<?php

namespace App;

enum ServiceApplicationStatus: string
{
    case Submitted = 'submitted';
    case InReview = 'in_review';
    case NeedsRevision = 'needs_revision';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Completed = 'completed';
}
