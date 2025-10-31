import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../api/convex/_generated/api';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #1e40af',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 4,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
    flex: 1,
  },
  keyFinding: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  findingTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  findingValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusGood: {
    color: '#059669',
  },
  statusWarning: {
    color: '#d97706',
  },
  statusCritical: {
    color: '#dc2626',
  },
  statusInfo: {
    color: '#2563eb',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
    borderTop: '1pt solid #d1d5db',
    paddingTop: 10,
  },
});

// PDF Document Component
const ComplianceReportPDF = ({ reportData }: { reportData: any }) => {
  const { executiveSummary, detailedBreakdown, generatedAt } = reportData;
  const reportDate = new Date(generatedAt).toLocaleDateString();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'good':
        return styles.statusGood;
      case 'warning':
        return styles.statusWarning;
      case 'critical':
        return styles.statusCritical;
      default:
        return styles.statusInfo;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PMI Compliance Audit Report</Text>
          <Text style={styles.subtitle}>Generated on {reportDate} | Executive Summary</Text>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>
              Overall Compliance: {executiveSummary.overallCompliance}%
            </Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>
              Based on {executiveSummary.evaluatedProjects} of {executiveSummary.totalProjects}{' '}
              projects evaluated
            </Text>
          </View>

          {/* Key Findings */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Key Findings</Text>
            {executiveSummary.keyFindings.map((finding: any, index: number) => (
              <View key={index} style={styles.keyFinding}>
                <Text style={styles.findingTitle}>{finding.title}</Text>
                <Text style={[styles.findingValue, getStatusStyle(finding.status)]}>
                  {finding.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Compliance Breakdown */}
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Metric</Text>
              <Text style={styles.tableCell}>Value</Text>
              <Text style={styles.tableCell}>Status</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Compliant Projects</Text>
              <Text style={styles.tableCell}>{executiveSummary.compliantProjects}</Text>
              <Text style={[styles.tableCell, getStatusStyle('good')]}>Good</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Non-Compliant Projects</Text>
              <Text style={styles.tableCell}>{executiveSummary.nonCompliantProjects}</Text>
              <Text
                style={[
                  styles.tableCell,
                  getStatusStyle(executiveSummary.nonCompliantProjects > 0 ? 'warning' : 'good'),
                ]}
              >
                {executiveSummary.nonCompliantProjects > 0 ? 'Needs Attention' : 'Good'}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Standards Coverage</Text>
              <Text style={styles.tableCell}>{executiveSummary.standardsCoverage} standards</Text>
              <Text style={[styles.tableCell, getStatusStyle('info')]}>Comprehensive</Text>
            </View>
          </View>
        </View>

        {/* Project Compliance Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Compliance Details</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Project</Text>
              <Text style={styles.tableCell}>Score</Text>
              <Text style={styles.tableCell}>Status</Text>
              <Text style={styles.tableCell}>Last Evaluation</Text>
            </View>
            {detailedBreakdown.projectCompliance.slice(0, 10).map((project: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{project.projectName}</Text>
                <Text style={styles.tableCell}>{project.complianceScore}%</Text>
                <Text
                  style={[
                    styles.tableCell,
                    getStatusStyle(
                      project.status === 'Compliant'
                        ? 'good'
                        : project.status === 'Partial'
                          ? 'warning'
                          : 'critical'
                    ),
                  ]}
                >
                  {project.status}
                </Text>
                <Text style={styles.tableCell}>
                  {new Date(project.lastEvaluation).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
          {detailedBreakdown.projectCompliance.length > 10 && (
            <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>
              ... and {detailedBreakdown.projectCompliance.length - 10} more projects
            </Text>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This report was generated automatically by the PMI Compliance Monitoring System. For
          detailed evidence and audit trails, please refer to the full system documentation.
        </Text>
      </Page>

      {/* Detailed Standards Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>PMI Standards Adherence</Text>
          <Text style={styles.subtitle}>Detailed Breakdown by Standard</Text>
        </View>

        {/* Standards Adherence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Standards Compliance Rates</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Standard</Text>
              <Text style={styles.tableCell}>Category</Text>
              <Text style={styles.tableCell}>Compliance Rate</Text>
              <Text style={styles.tableCell}>Evaluations</Text>
            </View>
            {detailedBreakdown.standardsAdherence.map((standard: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{standard.standardName}</Text>
                <Text style={styles.tableCell}>{standard.category}</Text>
                <Text
                  style={[
                    styles.tableCell,
                    getStatusStyle(
                      standard.complianceRate >= 80
                        ? 'good'
                        : standard.complianceRate >= 60
                          ? 'warning'
                          : 'critical'
                    ),
                  ]}
                >
                  {standard.complianceRate}%
                </Text>
                <Text style={styles.tableCell}>{standard.totalEvaluations}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Evidence Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evidence Management</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Evidence Type</Text>
              <Text style={styles.tableCell}>Count</Text>
              <Text style={styles.tableCell}>Status</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Total Evidence</Text>
              <Text style={styles.tableCell}>
                {detailedBreakdown.evidenceStatistics.totalEvidence}
              </Text>
              <Text style={[styles.tableCell, getStatusStyle('info')]}>Total</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Approved Evidence</Text>
              <Text style={styles.tableCell}>
                {detailedBreakdown.evidenceStatistics.approvedEvidence}
              </Text>
              <Text style={[styles.tableCell, getStatusStyle('good')]}>Verified</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Pending Review</Text>
              <Text style={styles.tableCell}>
                {detailedBreakdown.evidenceStatistics.pendingReview}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  getStatusStyle(
                    detailedBreakdown.evidenceStatistics.pendingReview > 0 ? 'warning' : 'good'
                  ),
                ]}
              >
                {detailedBreakdown.evidenceStatistics.pendingReview > 0
                  ? 'Needs Review'
                  : 'Up to Date'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>Page 2 of 2 - PMI Compliance Audit Report</Text>
      </Page>
    </Document>
  );
};

// Main Report Generator Component
export const ComplianceReportGenerator: React.FC = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');
  const [selectedReportType, setSelectedReportType] = useState<string>('executive_summary');
  const [showPreview, setShowPreview] = useState(false);

  // Get available data
  const portfolios = useQuery(api.portfolios.list) || [];
  const reportData = useQuery(api.complianceReports.generateComplianceReportData, {
    portfolioId: selectedPortfolio ? (selectedPortfolio as any) : undefined,
    reportType: selectedReportType as any,
  });

  const handleGenerateReport = () => {
    setShowPreview(true);
  };

  if (!reportData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 pb-3">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Compliance Report Generator
          </h3>
        </div>
        <div className="p-6 pt-3">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading report data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 pb-3">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Audit-Ready Compliance Report Generator
        </h3>
      </div>
      <div className="p-6 pt-3">
        <div className="space-y-6">
          {/* Report Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Scope
              </label>
              <select
                value={selectedPortfolio}
                onChange={e => setSelectedPortfolio(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Portfolios</option>
                {portfolios.map((portfolio: any) => (
                  <option key={portfolio._id} value={portfolio._id}>
                    {portfolio.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={selectedReportType}
                onChange={e => setSelectedReportType(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="executive_summary">Executive Summary</option>
                <option value="detailed_breakdown">Detailed Breakdown</option>
                <option value="audit_ready">Audit-Ready Report</option>
              </select>
            </div>
          </div>

          {/* Report Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Report Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {reportData.executiveSummary.overallCompliance}%
                </div>
                <div className="text-sm text-gray-600">Overall Compliance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reportData.executiveSummary.compliantProjects}
                </div>
                <div className="text-sm text-gray-600">Compliant Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {reportData.executiveSummary.nonCompliantProjects}
                </div>
                <div className="text-sm text-gray-600">Non-Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {reportData.executiveSummary.standardsCoverage}
                </div>
                <div className="text-sm text-gray-600">Active Standards</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <PDFDownloadLink
              document={<ComplianceReportPDF reportData={reportData} />}
              fileName={`compliance-report-${new Date().toISOString().split('T')[0]}.pdf`}
            >
              {({ loading }) => (
                <button
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Generating PDF...' : 'Download PDF Report'}
                </button>
              )}
            </PDFDownloadLink>

            <button
              onClick={handleGenerateReport}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          {/* PDF Preview */}
          {showPreview && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Report Preview</h3>
              <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <PDFViewer width="100%" height="100%">
                  <ComplianceReportPDF reportData={reportData} />
                </PDFViewer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
